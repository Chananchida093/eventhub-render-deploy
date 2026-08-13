package com.eventhub.controller;

import com.eventhub.dto.ApiDtos.*;
import com.eventhub.model.Role;
import com.eventhub.model.UserAccount;
import com.eventhub.repository.UserRepository;
import jakarta.servlet.http.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.*;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.security.Principal;

@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    public AuthController(AuthenticationConfiguration config, UserRepository users, PasswordEncoder passwordEncoder) throws Exception {
        this.authenticationManager = config.getAuthenticationManager(); this.users = users; this.passwordEncoder = passwordEncoder;
    }
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto signup(@Valid @RequestBody SignupRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists.");
        }
        UserAccount created = users.save(new UserAccount(email, passwordEncoder.encode(request.password()), request.name().trim(), Role.USER));
        return UserDto.from(created);
    }
    @PostMapping("/login")
    public UserDto login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String email = request.email().trim().toLowerCase();
        Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        SecurityContext context = SecurityContextHolder.createEmptyContext(); context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
        httpRequest.getSession(true).setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
        return users.findByEmail(email).map(UserDto::from).orElseThrow();
    }
    @PostMapping("/logout") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest request) { HttpSession session = request.getSession(false); if (session != null) session.invalidate(); SecurityContextHolder.clearContext(); }
    @GetMapping("/me")
    public UserDto me(Principal principal) {
        if (principal == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return users.findByEmail(principal.getName()).map(UserDto::from).orElseThrow();
    }
}

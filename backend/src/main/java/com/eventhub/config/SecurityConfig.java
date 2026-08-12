package com.eventhub.config;

import com.eventhub.repository.UserRepository;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean UserDetailsService userDetailsService(UserRepository users) {
        return email -> users.findByEmail(email)
                .map(user -> User.withUsername(user.getEmail()).password(user.getPassword()).roles(user.getRole().name()).build())
                .orElseThrow(() -> new UsernameNotFoundException(email));
    }

    @Bean SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/index.html", "/assets/**", "/favicon.ico", "/api/auth/**", "/api/events", "/api/events/*", "/h2-console/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
                .exceptionHandling(errors -> errors.authenticationEntryPoint((req, res, ex) -> res.sendError(HttpStatus.UNAUTHORIZED.value())))
                .build();
    }
}

package com.eventhub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class UserAccount {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String name;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private Role role;

    protected UserAccount() {}
    public UserAccount(String email, String password, String name, Role role) {
        this.email = email; this.password = password; this.name = name; this.role = role;
    }
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getName() { return name; }
    public Role getRole() { return role; }
}


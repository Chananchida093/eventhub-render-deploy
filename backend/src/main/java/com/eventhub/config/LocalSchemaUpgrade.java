package com.eventhub.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import java.util.List;

/** Keeps the local H2 demo database compatible when a role is added. */
@Component
@Order(1)
public class LocalSchemaUpgrade implements CommandLineRunner {
    private final JdbcTemplate jdbc;
    public LocalSchemaUpgrade(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @Override public void run(String... args) {
        jdbc.execute("alter table users alter column role varchar(20)");
        List<String> checks = jdbc.queryForList("select constraint_name from information_schema.table_constraints where table_name = 'USERS' and constraint_type = 'CHECK'", String.class);
        for (String check : checks) jdbc.execute("alter table users drop constraint \"" + check.replace("\"", "\"\"") + "\"");
        jdbc.execute("alter table users add constraint users_role_check check (role in ('USER', 'STAFF', 'ADMIN'))");
    }
}

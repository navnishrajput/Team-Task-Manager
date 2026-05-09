package com.teamtask.manager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TeamTaskManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(TeamTaskManagerApplication.class, args);
        System.out.println("===========================================");
        System.out.println("  Team Task Manager API is running!");
        System.out.println("  Base URL: http://localhost:8080/api");
        System.out.println("===========================================");
    }
}
package com.teamtask.manager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String tokenType;
    private Long userId;
    private String name;
    private String email;
    private String role;

    public static AuthResponseBuilder withToken(String token) {
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer");
    }
}
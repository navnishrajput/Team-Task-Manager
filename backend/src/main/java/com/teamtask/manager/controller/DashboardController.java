package com.teamtask.manager.controller;

import com.teamtask.manager.dto.response.DashboardResponse;
import com.teamtask.manager.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

    private final DashboardService dashboardService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<DashboardResponse> getProjectDashboard(
            @PathVariable Long projectId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("REST request to get dashboard for project: {}", projectId);
        DashboardResponse dashboard = dashboardService.getDashboardStats(projectId, userEmail);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/me")
    public ResponseEntity<DashboardResponse> getMyDashboard(
            Authentication authentication) {
        String userEmail = authentication.getName();
        logger.info("REST request to get personal dashboard for user: {}", userEmail);
        DashboardResponse dashboard = dashboardService.getUserDashboardStats(userEmail);
        return ResponseEntity.ok(dashboard);
    }
}
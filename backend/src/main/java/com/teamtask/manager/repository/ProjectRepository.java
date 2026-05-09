package com.teamtask.manager.repository;

import com.teamtask.manager.model.Project;
import com.teamtask.manager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Find all projects where user is a member
    @Query("SELECT p FROM Project p JOIN p.members pm WHERE pm.user = :user")
    List<Project> findByMember(@Param("user") User user);

    // Find all projects created by a user
    List<Project> findByCreator(User creator);
}
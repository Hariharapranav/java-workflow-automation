package com.workflow.dto;

import com.workflow.model.ApprovalStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApproveRequestDto {
    @NotNull
    private ApprovalStatus status; // APPROVED or REJECTED

    private String comments;
}

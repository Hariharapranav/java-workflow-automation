package com.workflow.dto;

import com.workflow.model.ApprovalStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RequestApprovalDto {
    private Long id;
    private Long requestId;
    private Long stepId;
    private Long approverId;
    private String approverName;
    private ApprovalStatus status;
    private String comments;
    private LocalDateTime createdAt;
}

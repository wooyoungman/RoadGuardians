package com.c104.guardians.service;

import com.c104.guardians.entity.Overload;
import com.c104.guardians.entity.Report;
import com.c104.guardians.repository.OverloadRepository;
import com.c104.guardians.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;

    public Report saveReport(Report report) {
        return reportRepository.save(report);
    }
}

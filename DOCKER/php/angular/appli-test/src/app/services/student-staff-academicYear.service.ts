import { Injectable } from '@angular/core';

@Injectable({
providedIn: 'root'
})
export class StudentStaffAcademicYearService {

    constructor() {}

    extractStudentTeacherAssignments() {
        return 'http://localhost:8000/api/affectation/extraction-affectations-etudiants-enseignants';
    }
}
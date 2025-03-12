import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FormDataService {
    private formData: any = {};

    getFormData() {
    return this.formData;
    }

    updateFormData(newData: any) {
    this.formData = { ...this.formData, ...newData };
    }

    getFieldValue(fieldName: string) {
    return this.formData[fieldName] || null;
    }

    initializeField(fieldName: string, defaultValue: string | boolean | Date, type: string) {
    if (!this.formData[fieldName]) {
        this.formData[fieldName] = {
        value: defaultValue,
        type: type
    };
    }
    }

    updateField(fieldName: string, value: string) {
        if (this.formData[fieldName]) {
            this.formData[fieldName].value = value;
        } else {
            console.warn(`Field ${fieldName} does not exist in formData`);
        }
    }
}
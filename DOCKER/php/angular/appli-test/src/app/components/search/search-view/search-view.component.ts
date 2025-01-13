import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InternshipSearch } from '../../../models/internship-search.model';
import { InternshipSearchService } from '../../../services/internship-search.service';
import { NavigationService } from '../../../services/navigation.service';
import { SearchFormComponent } from '../../dashboard/student-dashboard/search-form/search-form.component';

@Component({
  selector: 'app-search-view',
  standalone: true,
  imports: [CommonModule, SearchFormComponent],
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.css']
})
export class SearchViewComponent implements OnInit {
  search?: InternshipSearch;
  breadcrumbs = this.navigationService.getBreadcrumbs('Détails de la recherche');

  constructor(
    private readonly route: ActivatedRoute,
    private readonly internshipSearchService: InternshipSearchService,
    private readonly navigationService: NavigationService
  ) {}

  ngOnInit() {
    const searchId = this.route.snapshot.paramMap.get('id');
    if (searchId) {
      this.internshipSearchService.getSearchById(parseInt(searchId))
        .subscribe(search => {
          this.search = search;
        });
    }
  }

  onSave(updatedSearch: Partial<InternshipSearch>) {
    if (this.search?.idRecherche) {
      this.internshipSearchService.updateSearch(this.search.idRecherche, updatedSearch)
        .subscribe(() => {
          this.navigationService.navigateToStudentDashboard();
        });
    }
  }

  onCancel() {
    this.navigationService.navigateToStudentDashboard();
  }
} 
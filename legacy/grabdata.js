let jobRolesData = [];

function generateJobRoleTable(job_title, description, last_date) {
  const tbody = document.querySelector('#job-table tbody');
  const tr = document.createElement('tr');
  const td1 = document.createElement('td');
  td1.classList.add("title");
  const td2 = document.createElement('td');
  td2.classList.add("description");
  const td3 = document.createElement('td');
  td3.classList.add("lastdate");
  const td4 = document.createElement('td');
  const applyButton = document.createElement('button');

  td1.textContent = job_title;
  td2.textContent = description;
  td3.textContent = last_date;
  applyButton.textContent = 'Apply';
  applyButton.classList.add('apply-button');
  td4.appendChild(applyButton);
  applyButton.addEventListener('click', () => {
    const subject = `Applying for the ${job_title} position`;
    const body = `Hello,\n\nI am interested in applying for the ${job_title} position. Here's a brief introduction about myself:\n\n`;
    const mailtoLink = `mailto:hr@infocuscs.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, "_blank");
  });
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  tbody.appendChild(tr);
}

function getJobRoles() {
  const url = "https://raw.githubusercontent.com/infocuscs/Data/main/JobsData.json";
  fetch(url).then(res => res.json())
  .then(data => {
    jobRolesData = data;
    jobRolesData.forEach(job => {
      generateJobRoleTable(job.job_title, job.description, job.last_date);
    });
    addSearchAndFilterListeners();
  }).catch(err => console.log(err));
}

function addSearchAndFilterListeners() {
  const searchInput = document.querySelector('#search');
  const filterSelect = document.querySelector('#filter');

  searchInput.addEventListener('input', handleSearchInput);
  filterSelect.addEventListener('change', handleFilterChange);
}

function handleSearchInput(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filter = document.querySelector('#filter').value;
  const filteredData = jobRolesData.filter(job => {
    if (filter === 'all') {
      return job.job_title.toLowerCase().includes(searchTerm) ||
             job.description.toLowerCase().includes(searchTerm) ||
             job.last_date.toLowerCase().includes(searchTerm);
    } else {
      return job[filter].toLowerCase().includes(searchTerm);
    }
  });

  clearTable();
  filteredData.forEach(job => {
    generateJobRoleTable(job.job_title, job.description, job.last_date);
  });
}

function handleFilterChange(event) {
  const searchTerm = document.querySelector('#search').value.toLowerCase();
  const filter = event.target.value;
  const filteredData = jobRolesData.filter(job => {
    if (filter === 'all') {
      return job.job_title.toLowerCase().includes(searchTerm) ||
             job.description.toLowerCase().includes(searchTerm) ||
             job.last_date.toLowerCase().includes(searchTerm);
    } else {
      return job[filter].toLowerCase().includes(searchTerm);
    }
  });

  clearTable();
  filteredData.forEach(job => {
    generateJobRoleTable(job.job_title, job.description, job.last_date);
  });

  // Update search input placeholder based on filter
  const searchInput = document.querySelector('#search');
  const filterName = filter.replace(/_/g, ' '); // Replace underscores with spaces
  const camelCaseFilterName = filterName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  if (filter === 'all') {
    searchInput.placeholder = 'Search by job title, description, or last date';
  } else {
    searchInput.placeholder = `Search by ${camelCaseFilterName}`;
  }

}


function clearTable() {
  const tbody = document.querySelector('#job-table tbody');
  tbody.innerHTML = '';
}

getJobRoles();
function generateEmail() {
  console.log(jobRolesData);

} 

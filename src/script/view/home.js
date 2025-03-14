import Utils from '../utils.js';
import Clubs from '../data/local/clubs.js';

const home = () => {
  const clubListContainerElement = document.querySelector('#clubListContainer');
  const clubLoadingElement = clubListContainerElement.querySelector('.search-loading');
  const clubListElement = clubListContainerElement.querySelector('.club-list');
  const listElement = clubListElement.querySelector('.list');
  const searchInputElement = document.querySelector('#searchInput');
  const searchButtonElement = document.querySelector('#searchButton');
  const detailContainerElement = document.querySelector('#clubDetailContainer');

  const showSportClub = () => {
    showLoading();

    const result = Clubs.getAll();
    displayResult(result);

    showClubList();
  };

  const displayResult = (clubs) => {
    if (clubs.length === 0) {
      listElement.innerHTML = `
        <p class="placeholder">No clubs found. Try a different keyword!</p>
      `;
      return;
    }

    const clubItems = clubs.map((club) => {
      return `
        <div class="card" onclick="showClubDetail('${club.strTeam}')">
          <img
            class="fan-art-club"
            src="${club.strTeamBadge}"
            alt="Fan Art: ${club.strTeam}"
          >
          <div class="club-info">
            <div class="club-info__title">
              <h2>${club.strTeam}</h2>
            </div>
            <div class="club-info__description">
              <p>${club.strDescriptionEN.slice(0, 100)}...</p>
            </div>
          </div>
        </div>
      `;
    });

    listElement.innerHTML = clubItems.join('');
  };

  const displayClubDetail = (club) => {
    detailContainerElement.innerHTML = `
      <div class="club-detail">
        <h2>${club.strTeam}</h2>
        <img class="detail-image" src="${club.strTeamBadge}" alt="${club.strTeam}">
        <p>${club.strDescriptionEN}</p>
        <button id="backButton" class="back-button">Back</button>
      </div>
    `;
    Utils.showElement(detailContainerElement);

    const backButton = document.querySelector('#backButton');
    backButton.addEventListener('click', () => {
      Utils.hideElement(detailContainerElement);
      showClubList();
    });
  };

  const showClubDetail = (clubName) => {
    const club = Clubs.getAll().find((c) => c.strTeam === clubName);
    if (club) {
      Utils.hideElement(clubListElement);
      displayClubDetail(club);
    }
  };

  const showLoading = () => {
    Array.from(clubListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(clubLoadingElement);
  };

  const showClubList = () => {
    Array.from(clubListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(clubListElement);
  };

  const searchClubs = () => {
    const keyword = searchInputElement.value.toLowerCase();
    const allClubs = Clubs.getAll();
    const filteredClubs = allClubs.filter((club) =>
      club.strTeam.toLowerCase().includes(keyword)
    );

    displayResult(filteredClubs);
  };

  searchButtonElement.addEventListener('click', searchClubs);
  searchInputElement.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      searchClubs();
    }
  });

  showSportClub();

  // Fix to properly bind the showClubDetail function to the global scope
  window.showClubDetail = showClubDetail;
};

export default home;

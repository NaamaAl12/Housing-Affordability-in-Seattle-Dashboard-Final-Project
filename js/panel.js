const DEFAULT_YEAR = 2022;
const DEFAULT_RACE = 'All';
const DEFAULT_LAYER = 'mha';


function initPanel() {
  initYearSlider();
  initRaceButtons();
  initLayerToggle();
}


function initYearSlider() {
  const slider  = document.getElementById('year-slider');
  const display = document.getElementById('year-display');
  if (!slider) return;

  slider.addEventListener('input', function () {
    const year = parseInt(this.value);

    if (display) display.textContent = year;

    updateChartsForYear(year);
  });
}


function initRaceButtons() {
  const buttons = document.querySelectorAll('.race-btn');
  if (!buttons.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {

      buttons.forEach(b => b.classList.remove('active'));

      this.classList.add('active');

      const race = this.dataset.race;

      updateChartsForRace(race);
    });
  });
}


function initLayerToggle() {
  const buttons = document.querySelectorAll('.layer-btn');
  if (!buttons.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {

      buttons.forEach(b => b.classList.remove('active'));

      this.classList.add('active');

      const layer = this.dataset.layer;

      setMapLayer(layer);

      const legend = document.getElementById('legend');
      if (legend) {
        legend.style.opacity = layer === 'mha' ? '1' : '0.3';
      }
    });
  });
}

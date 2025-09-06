export function renderAllBetsTable(allBets, allBetsBody) {
    allBetsBody.innerHTML = allBets.map(bet => `
    <div class="bets-table-row ${bet.x > 0 ? 'active' : ''}">
      <div class="bets-table-col body-col">${bet.player}</div>
      <div class="bets-table-col body-col bold bet-col">${bet.bet}₹</div>
      <div class="bets-table-col body-col bold count-col">${bet.x > 0 ? bet.x : '-'}</div>
      <div class="bets-table-col body-col hero-color win-col">${bet.win > 0 ? bet.win + '₹' : '-'}</div>
    </div>
  `).join('');
}

export function renderMyBetsTable(myBets, myBetsBody) {
    myBetsBody.innerHTML = myBets.map(bet => `
    <div class="bets-table-row my-bets ${bet.x > 0 ? 'active' : ''}">
      <div class="bets-table-row-inner">
        <div class="bets-table-col body-col">${bet.date}</div>
        <div class="bets-table-col body-col bold bet-col">${bet.bet}₹</div>
        <div class="bets-table-col body-col bold count-col">${bet.x > 0 ? bet.x : '-'}</div>
        <div class="bets-table-col body-col hero-color win-col">${bet.win > 0 ? bet.win + '₹' : '-'}</div>
        <i class="my-bets-arrow fa-solid fa-angle-down"></i>
      </div>
      <div class="bets-table-collapsed-content">
          <div class="bets-table-collapsed-content-inner">
            <div class="bets-table-collapsed-column">
              <span class="bets-table-collapsed-title">Balance before:</span>
              <p class="bets-table-collapsed-balance">${bet.balBefore}₹</p>
            </div>
            <div class="bets-table-collapsed-column">
              <span class="bets-table-collapsed-title">Balance after:</span>
              <p class="bets-table-collapsed-balance green">${bet.balAfter}₹</p>
            </div>
          </div>
        </div>
    </div>
  `).join('');

    // Add click listeners to arrows after rendering
    myBetsBody.querySelectorAll('.my-bets-arrow').forEach(arrow => {
        arrow.addEventListener('click', () => {
            arrow.closest('.bets-table-row').classList.toggle('open');
        });
    });
}

export function renderHighestTable(highestCrash, highestTableBody) {
    highestTableBody.innerHTML = highestCrash.map(bet => `
    <div class="bets-table-row">
      <div class="bets-table-col body-col">${bet.date}</div>
      <div class="bets-table-col body-col bold count-col">${bet.x.toFixed(2)}</div>
      <div class="bets-table-col body-col hero-color info-col">
        <i class="fa-solid fa-circle-check"></i>
      </div>
    </div>
  `).join('');
}


export function renderList(results, listElement) {
    listElement.innerHTML = ""; // Clear first
    results.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("last-statistics-list-item");

        const div = document.createElement("div");
        div.classList.add("last-statistics-round-item");
        div.textContent = `x${item.result}`;

        // Add color class based on result value
        if (item.result >= 2 && item.result < 20) {
            div.classList.add("orange");
        } else if (item.result >= 20 && item.result < 100) {
            div.classList.add("blue");
        } else if (item.result >= 100) {
            div.classList.add("red");
        }

        const p = document.createElement("p");
        p.classList.add("last-statistics-round");
        p.textContent = item.roundId;

        li.appendChild(div);
        li.appendChild(p);
        listElement.appendChild(li);
    });
}

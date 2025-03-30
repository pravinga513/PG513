document.addEventListener(&quot;DOMContentLoaded&quot;, function () {
    const spinner = document.getElementById(&quot;loading-spinner&quot;);
    let gamesData = [];

    async function fetchGames(retries = 3) {
        try {
            spinner.style.display = &quot;block&quot;; // Show spinner
            const response = await fetch(&quot;https://corsproxy.io/?&quot; + encodeURIComponent(&quot;https://www.gamerpower.com/api/giveaways&quot;));
            if (!response.ok) throw new Error(&quot;Network response was not ok&quot;);

            const data = await response.json();
            gamesData = data; // No need to parse if using corsproxy.io
            displayGames(gamesData);
        } catch (error) {
            if (retries &gt; 0) {
                console.warn(&quot;Retrying fetch...&quot;, retries);
                fetchGames(retries - 1);
            } else {
                document.getElementById(&quot;game-list&quot;).innerHTML = &quot;<p>Error fetching games. Please try again later.</p>&quot;;
                console.error(&quot;Error fetching data:&quot;, error);
            }
        } finally {
            spinner.style.display = &quot;none&quot;; // Hide spinner
        }
    }

    function displayGames(games) {
        const gameList = document.getElementById(&quot;game-list&quot;);
        gameList.innerHTML = &quot;&quot;;

        games.forEach((game) =&gt; {
            const gameCard = document.createElement(&quot;div&quot;);
            gameCard.classList.add(&quot;game-card&quot;);

            gameCard.innerHTML = `
                <img alt='${game.title}' src='${game.thumbnail}'/>
                <div class='platform-icons'>${getPlatformIcons(game.platforms)}</div>
                <div class='game-info'>
                    <h3>${game.title}</h3>
                    <p class='price'><span class='original-price'>$${game.worth}</span> <span class='free-price'>Free</span></p>
                    <p class='description'>${game.description}</p>
                    <div class='extra-content' style='display: none;'>
                        <p>Instructions: ${game.instructions}</p>
                        <p>Type: ${game.type}</p>
                        <p>Platforms: ${game.platforms}</p>
                    </div>
                    <div class='actions'>
                        <a class='claim-btn' href='${game.open_giveaway}' target='_blank'>Claim Now</a>
                        <button class='icon-btn toggle-info'>ℹ&#65039;</button>
                    </div>
                </div>
            `;

            gameCard.querySelector(&quot;.toggle-info&quot;).addEventListener(&quot;click&quot;, function () {
                const extraContent = gameCard.querySelector(&quot;.extra-content&quot;);
                extraContent.style.display = extraContent.style.display === &quot;block&quot; ? &quot;none&quot; : &quot;block&quot;;
                gameCard.classList.toggle(&quot;expanded&quot;);
            });

            gameList.appendChild(gameCard);
        });
    }

    function getPlatformIcons(platforms) {
        const icons = {
            &quot;PC&quot;: &#39;<i class='fa-brands fa-windows'/>&#39;,
            &quot;Steam&quot;: &#39;<i class='fa-brands fa-steam'/>&#39;,
            &quot;Epic Games Store&quot;: &#39;<i class='fa-solid fa-store'/>&#39;,
            &quot;itch.io&quot;: &#39;<i class='fa-brands fa-itch-io'/>&#39;,
            &quot;GOG&quot;: &#39;<i class='fa-solid fa-gamepad'/>&#39;,
            &quot;Xbox One&quot;: &#39;<i class='fa-brands fa-xbox'/>&#39;,
            &quot;PS4&quot;: &#39;<i class='fa-brands fa-playstation'/>&#39;,
            &quot;Nintendo&quot;: &#39;<i class='fa-solid fa-gamepad'/>&#39;,
            &quot;Android&quot;: &#39;<i class='fa-brands fa-android'/>&#39;,
            &quot;iOS&quot;: &#39;<i class='fa-brands fa-apple'/>&#39;,
            &quot;DRM-Free&quot;: &#39;<i class='fa-solid fa-unlock'/>&#39;
        };
        return platforms.split(&quot;, &quot;).map(platform =&gt; icons[platform] || &quot;&quot;).join(&quot; &quot;);
    }

    function filterGames(platform, event) {
        document.querySelectorAll(&quot;nav a&quot;).forEach(link =&gt; link.classList.remove(&quot;active&quot;));
        event.target.classList.add(&quot;active&quot;);

        if (platform === &quot;All&quot;) {
            displayGames(gamesData);
        } else {
            const filteredGames = gamesData.filter(game =&gt; game.platforms.includes(platform));
            displayGames(filteredGames);
        }
    }

    fetchGames();
});

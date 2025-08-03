# Dragon Rangers
Dragon Rangers is an action-packed arcade game where you play as a small dragon god, drawing magical loops to trap and defeat forest creatures. Collect their soul pearls to unlock powerful abilities and grow stronger with every battle.

Dragon Rangers was made during GMTK Game Jam 2025.

**Controls**

* Hold and drag to draw a loop
* Draw a loop around an enemy to deal damage
* In the level select screen, you can:
  * Draw a loop around the level you want to play
  * Draw a loop around the pearl icon to swap out your active ability

**Team**

* Golen (code & art)
* LuxxArt (art)
* MatoCookies (music & juice)
* Nightlightlumie (monster)
* almost.everywhere (music)
* ArcticFqx (code)
* Dreeda (code)
* Wilon (art)

## Quick start
### Prerequisites
* Git installed.
* Node 20+ installed.

### Steps
1. Clone the repository
2. `npm install`
3. `npm run dev`

Remember to update [`game.config.json`](game.config.json) accordingly.

## Building

1. `npm run build`
2. Build goes to `/dist` directory

## Debugging
This assumes you have VS Code and Chrome installed

* Hit F5 to debug
    * This will launch Vite and Chrome
    * You can now add breakpoints in VS Code
* Hit Shift+F5 twice to stop debugging

## Deploying
### GitHub
The repository is configured to automatically deploy to Github Pages, you just have to set `GitHub Actions` as the Build and Deployment source setting in the repo Pages settings.

It will also create new downloads under releases.
### Itch
You can configure this repository to automatically deploy and upload releases to Itch. What you have to do is set the `BUTLER_CREDENTIALS` repository secret and set your Itch username and game name in [`game.config.json`](game.config.json).

## System requirements
### Web
A modern up-to-date web browser

### Windows
* Microsoft Edge 89 or newer
* [WebView2](https://go.microsoft.com/fwlink/p/?LinkId=2124703) installed (Windows 11 has this preinstalled)

### MacOS
* Safari 15 or newer

### Linux
* WebKitGTK installed

## Notes
### Mac
The app is unsigned when built, so you need to follow these steps when distributing:
1. First you need to extract the .app from the .dmg before attempting to run the game.
2. Second, try running the game, a popup will say the app is unverified.
3. Right click/Open the context menu on the .app, hold option, click open.
4. Click open in the popup.

The game will start normally from now on.

### Linux
You may have to mark the games as executable before it will let you run them.

There have been reports of the game freezing, so the web version might be preferred in that case. 

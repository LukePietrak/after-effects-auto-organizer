# Auto Project Organizer 2.0

Automatically sort After Effects project items into Comps, Images, Videos and Audios, with customizable folder names and label indices. The organizer moves project items (not files on disk), including items inside existing folders. Solids, placeholders and other footage without an associated file are skipped. Existing folders are not deleted. Save a copy of your project before first use; each organization operation is one Undo group. Settings are session-only; Undo does not revert the panel's in-memory settings. Label names describe the default palette and can differ with AE preferences. Image sequences are treated as video.

## Recommended: ScriptUI panel
Target: After Effects 2022–2026, Windows and macOS (not host-tested).
1. Close After Effects.
2. Copy `ScriptUI/Auto Project Organizer.jsx` into the installed application's `Scripts/ScriptUI Panels` directory.
   - Windows: `C:\Program Files\Adobe\Adobe After Effects 2026\Support Files\Scripts\ScriptUI Panels\`
   - macOS: `/Applications/Adobe After Effects 2026/Scripts/ScriptUI Panels/`
   Adjust the year for your installed version. Administrator permission may be needed.
3. Restart After Effects and open Window > Auto Project Organizer.jsx (near the bottom).
Alternatively, File > Scripts > Run Script File lets you open the JSX as a floating panel without installing it.
4. Click Setup Folders, Run Organizer, or Settings. Settings renames existing root category folders and changes their labels; Run Organizer applies labels to their contents.

## Optional: CEP source extension
Target manifest range: AE 18.4–26.99 (2021 update through 2026); CSXS 11 or newer. This is unsigned development source, not a signed ZXP. Adobe is transitioning to UXP; this is not a UXP plugin. For general distribution use the ScriptUI file, or arrange proper CEP signing. Existing CEP availability can vary by AE build.
Copy `CEP/AutoProjectOrganizer` as a whole into the user CEP extensions directory: Windows `%APPDATA%\Adobe\CEP\extensions`, macOS `~/Library/Application Support/Adobe/CEP/extensions`. Unsigned panels need developer mode (see Adobe CEP cookbook below); this enables other unsigned panels too, so use only in a trusted development environment and disable it afterward. Restart AE and look under Window > Extensions or Extensions (Legacy). No Node.js access or third-party JS dependency is needed.

## Verification
Node syntax checks, XML parsing, resource path checks, and mocked project logic tests passed. Actual After Effects runtime, docking, dialog behavior and CEP installation/signing have not been tested. Run `node tests/test.js` for the mock suite. For a real smoke test, import a still, image sequence, video and audio; create a comp and solid; run twice; rename a category, rerun, and Undo. Verify all project items and links remain intact.

References: https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_12.x/Documentation/CEP%2012%20HTML%20Extension%20Cookbook.md

https://community.adobe.com/announcements-532/after-effects-is-adding-uxp-plugin-support-public-beta-now-open-1656525

Windows File Location: C:\Program Files\Adobe\Adobe After Effects 2026\Support Files\Scripts\ScriptUI Panels\

Mac File Location: /Applications/Adobe After Effects 2026/Scripts/ScriptUI Panels/
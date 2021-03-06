# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- The 'Enter' key shortcut will be bound to the instant messaging system.

## [0.4.0] - 2019-1-2
### Added
- Added the ability to chat to a room. The chat uses usernames to help
identify which messages came from who.
- Added more socket messages in the backend to support the ability to have
instant messaging in rooms.
- Added form field for a user name on the frontend.
- Added user name support in the backend.

### Changed
- Removed the ability to press the 'Enter' key as a shortcut to load the video
as it will be used instead for the instant messages.

## [0.3.1] - 2019-1-1
### Added
- Added the ability for the bottom panel to switch between notification and
chat.
- Added the ability for the bottom panel to be minimised and expanded.
- Added CSS animation to the bottom panel when it is expanded / minimised.

### Fixed
- Fixed a bug with the local storage where the notifications were stored as
an entire string instead of individual sentences.

## [0.3.0] - 2019-1-1
### Added
- Created a bottom panel to house the notification and chat functionality that
you can switch between.

### Changed
- Moved the separate components into their own files to keep the code clean.
- Moved the entire notification area into the bottom panel.
- The notification area will now store previous notifications instead of
replacing the previous one with the new notification.
- Added a message to link to the Github page to replace the notification area.

## [0.2.5] - 2018-12-31
### Added
- When user joins a room, they will be updated to watch that video.
- Added icons to the frontpage inputs.
- Attributions

## [0.2.4] - 2018-12-31
### Added
- Ability to update the video URL via hitting an Enter key.
- Error message for the server name / passphrase panel.

### Fixed
- Patched the ability to create an empty room name as it will conflict the
frontend's ability to update itself.

## [0.2.3] - 2018-12-31
### Added
- A changelog
- Ability for the video player to dynamically resize to the user's screen

### Changed
- Minor change to the title from 'React App' to 'JARP Community Video Project'

### Fixed
- Fixed a bug that caused users who join the server to not be able to influence the
room.
- Fixed a bug that did not reset the video player after the user left the room.

## [0.2.1] - 2018-12-31
### Added
- Docker support

## [0.2.0] - 2018-12-30
### Added
- First release of the working website

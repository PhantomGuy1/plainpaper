# Local Storage and Backup — Requirements

## Introduction

PlainPaper keeps everything on the user's device. Papers and settings live
in one versioned localStorage object — the shape add-a-paper established — so
the stored shape can change later without breaking old data. One tap exports
a JSON backup; one tap restores it, with a plain warning before anything is
overwritten and a clear error if the file is not a PlainPaper backup. The
first time a user opens the app with no papers, a plain-words welcome
explains it and shows the privacy line. No account, no server, nothing leaves
the device.

## User stories

- As a private user, I want my papers to live only on my device, so nothing
  is uploaded.
- As a user, I want to download a backup of all my papers, so I don't lose
  them if I clear my browser.
- As a user, I want to restore a backup, so I can move my papers to a new
  device.
- As a non-technical user, I want a warning before a restore overwrites my
  current papers, so I don't lose something by accident.
- As a first-time user, I want a plain explanation of what the app does, so I
  know what I'm looking at.

## Acceptance criteria

1. The system shall persist all PlainPaper data in a single versioned object
   in the browser localStorage and shall not transmit any data to any network
   endpoint.
2. The system shall include a version field in the stored object and shall
   use it to migrate older data when the stored shape changes.
3. When the user taps Export, the system shall download a JSON file containing
   the full versioned store, generated entirely on the device.
4. When the user taps Import and selects a file, the system shall read and
   parse the file on the device without uploading it.
5. If the selected file does not contain a versioned PlainPaper store (a
   version field and a papers array), the system shall show a clear
   plain-English error and shall not change any stored data.
6. Before a valid import overwrites the current data, the system shall show a
   plain-English warning that importing replaces everything on the device and
   shall require the user to confirm.
7. On confirmation, the system shall run the imported store through the
   version migration hook, write it to localStorage, and re-render.
8. The home screen shall show the line "Your papers stay on this device.
   Nothing is uploaded." exactly.
9. When the store contains no papers, the system shall show a first-run state
   that explains the app in plain words and a way to add the first paper.
10. The system shall require no account, no sign-in, and no network
    connection to use, export, or import.
11. The system shall not infer, estimate, or add any value the user did not
    enter during export or import.


Web app for playing the Star Trek Collectible Card Game
([ST:CCG](https://en.wikipedia.org/wiki/Star_Trek_Customizable_Card_Game))
with an opponent using another web browser.

Available publicly at
[net-stccg.firebaseapp.com](https://net-stccg.firebaseapp.com/).  Sign
in requires a Google account.


## To Play

1. Go to the game's home [net-stccg.firebaseapp.com](https://net-stccg.firebaseapp.com/)
2. Click the "Sign in with Google" button
3. Create (at least) a deck
    * details to go here
4. Click "Start Game"
5. Click "Get Game Code"
6. Contact the person you want to play against
    * have them go through the steps through #4
    * have them enter the Game Code you generated and
      click "Play Game"
    * when they're done, your browser will go to the play screen


## Development

### Client

The in-browser code is implemented as a single-page web application
using React and webpack.  To run it locally, open a terminal and go to
the directory containing `net-stccg`, then:

```bash
cd Webclient
npm install
npm start
```

This should open you system's default browser and connect it to the
local webpack development server.


### Server


#### Deploy

```bash
cd Webclient
npm install
npm build
cd ../Firebase
firebase login
firebase deploy
```

## References

Here are a bunch of references I used during development:

* first suggestion of using live updates from Cloud Firestore as a
browser-to-browser communication mechanism: https://stackoverflow.com/questions/42995171/what-is-the-proper-way-to-use-websockets-in-firebase
* https://css-tricks.com/firebase-react-part-2-user-authentication/
* source for Google signin button https://developers.google.com/identity/branding-guidelines

Background on "serverless" webapp architectures, used prior to
choosing Google Firebase:

* generic
    * https://medium.com/@ste.grider/serverless-showdown-aws-lambda-vs-firebase-google-cloud-functions-cc7529bcfa7d
    * https://read.acloud.guru/six-months-of-serverless-lessons-learned-f6da86a73526
    * https://medium.com/cloud-academy-inc/serverless-beyond-functions-cd81ee4c6b8d
* ways to do browser-to-browser communication
    * AWS IoT framework:  https://serverless.com/blog/realtime-updates-using-lambda-websockets-iot/
    * WebRTC
        * https://www.scaledrone.com/blog/webrtc-chat-tutorial/
        * https://developer.mozilla.org/en-US/docs/Web/Guide/API/WebRTC/Peer-to-peer_communications_with_WebRTC




## To Do

### Immediate

* add Introductory 2-Player Game card set
* add Warp Pack card set
* add Alternate Universe card set
* preload deck options/buttons
    - random primier + warp pack


### Features Soon

* playable-by-definition flag for pregen decks
* Available Card list shows overflow from pregen deck
* when editing a pregen deck
    - can swap between overflow list and full list
    - back-to-overflow button in place of Delete
* CardName items have icons for
    - card type
    - affiliation
    - attributes
* can sort subdeck lists, Available list by column content
* filter Available Card list (substring text match)
* prevent drag from Availables based on deck content (no duplicates of non-universal missions)
* number of cards in subdeck, subdeck playable, in header
* preload deck options/buttons
    - random Official Tournament Sealed Deck mix
    - random Deep Space 9 deck
    - random Starter Deck II
    - random Voyager deck
* support for finite set in Available Card list
* indicators n deck-select dropdown, by Start Game link, when deck isn't legal (yet)


### Long Term

Stuff that I skipped doing "when I could have" in order to get to a
broader set of functionality:

* tune service worker config so it handles background image, card images
* show "waiting...." spinner while Game Code is being generated
* put Google avatar image next to all uses of displayName
* refactor to put Profile component directly under App
* refactor to create a Home component that App routes to "/" and
  renders sub-components
* drag/drop to sort within subdeck
* implement "delete" for decks
* implement "rename" for decks
* fix console warning about how firebase lib is imported
* clean up old/orphan Game Code values
* flatten and/or extract some of the promises for db access (to make
  more readable/maintainable)
* handle window resizing

Stuff that I'd do if this were going to be a long-lived,
production-worthy project:

* establish multiple db instances/environments (dev, ci integration
  test, staging, production)
* incorporate unit & Se test frameworks, backfill missing tests
* better linting, conform to linting, automate linting
* establish CI & coverage & put badges in README

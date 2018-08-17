
Web app for playing the Star Trek Collectible Card Game
([ST:CCG](https://en.wikipedia.org/wiki/Star_Trek_Customizable_Card_Game))
with an opponent using another web browser.

Available publicly at
[net-stccg.firebaseapp.com](https://net-stccg.firebaseapp.com/).  Sign
in requires a Google account.


## To Do

Stuff that I skipped doing "when I could have" in order to get to a
broader set of functionality:

* tune service worker config so it handles background image, card images
* show "waiting...." spinner while Game Code is being generated
* clean up old/orphan Game Code values
* flatten and/or extract some of the promises for db access (to make
more readable/maintainable)


Stuff that I'd do if this were going to be a long-lived,
production-worthy project:

* establish multiple db instances/ environments (dev, ci integration
  test, staging, production)
* incorporate unit & Se test frameworks, backfill missing tests
* better linting, conform to linting, automate linting
* establish CI & coverage & put badges in README


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



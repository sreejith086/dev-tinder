# dev-tinder
# auth-router
post /signup
post /login
post /logout

# profile router
patch /profile/edit
GET /profile/view
patch profile/password


-post /request/send/interested/:userid
-post /request/send/ignored/:userid
-post /request/review/requested/:requestId
-post /request/review/rejected/:requestId

-GET  /user/connections
-GET  /user/request/received
-GET  /user/feed

status : ignore,interest,accepted, rejected

Meteor.publish("allDevoirHeaders", function(){
    return Devoir.find({}, {
        fields: {content: 0}
    });
});
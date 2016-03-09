if (Meteor.isClient) {

    Meteor.subscribe("tasks");

    Template.todo.helpers({
        tasks: function () {
            if (Session.get("hideCompleted")) {
                // If hide completed is checked, filter tasks
                // $ne : not equal to
                return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
            } else {
                // Otherwise, return all of the tasks
                return Tasks.find({}, {sort: {createdAt: -1}});
            }
        },
        hideCompleted: function () {
            return Session.get("hideCompleted");
        },
        incompleteCount: function () {
            return Tasks.find({checked: {$ne: true}}).count();
        },
        isOwner: function () {
            return this.owner === Meteor.userId();
        }
    });

    // body는 무엇을 의미하는가?
    // todo에 바인딩이 되지 않는 이유는 무엇인가?
    Template.todo.events({
        'submit .new-task': function (event) {
            event.preventDefault();
            var text = event.target.text.value;
            Meteor.call("addTask", text);
            event.target.text.value = "";
        },

        'change .hide-completed input': function (event) {
            Session.set("hideCompleted", event.target.checked);
        },

        'click .toggle-checked': function () {
            Meteor.call("setChecked", this._id, !this.checked);
        },
        'click .delete': function () {
            Meteor.call("deleteTask", this._id);
        },
        "click .toggle-private": function () {
            Meteor.call("setPrivate", this._id, ! this.private);
        }

    });

    Meteor.startup(function () {
       $('.new-task input[name=text]').focus();
    });

    /**
     * TODO 1. account-ui-unstyle로 변경할 것
     * TODO 2. 각 계정을 id, secret키를 설정하는 방법을 알아볼 것
     * TODO 3. 이 코드는 이곳에 있는 것이 맞나? 공통으로 사용할 모듈을 외부로 빼야할 것이다
     */
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
    });


    /**
     * 로그인이 되었는지 여부를 알 수 있음
     * 로그인과 소유 일치 여부를 확인한다
     * 단순히 로그인만 알려면 Meteor.loggingIn()
     */
    Template.content.helpers({
        isLogin: function(owner) {
            return (owner === Meteor.userId());
        }
    });

}
var App = {};



App.Task = Backbone.Model.extend({
  idAttribute: "_id",
  initialize: function () {
    this.bind('error', this.showError);
    this.bind('remove', this.removeTask);
  },
  validate: function(attrs) {
    if (!attrs.title) {
      return "Please enter a task";
    }
  },
  showError: function (model, error) {
    alert(error);
  },
  removeTask: function () { 
    this.destroy();
  }
}); 

App.Tasks = Backbone.Collection.extend({
  model: App.Task,
  url: '/api/tasks'
});


App.View2 = Backbone.View.extend({
  el: $("#tasks2"),
  tagName: 'h1',
  initialize: function() {
    this.hello = _.template($('#tpl-cert').html());
    this.render();
  },
  render: function() {
 	var args = {person: "John"};
    $(this.el).html(this.hello(args));

  }
});

App.TasksView = Backbone.View.extend({
  el: $("#tasks"),
  initialize: function() {
    this.task_form = _.template($('#task_form').html());
    this.tasks_template = _.template($('#tasks_template').html());
    this.task_template = _.template($('#task_template').html());

    this.render();
  },
  render: function() {

    $(this.el).html(this.tasks_template({
      task_form: this.task_form,
      tasks: this.collection.models,
      task_template: this.task_template
    }));
	
	

  },
  events : {
    'submit form' : 'createTask',
    'click button' : 'deleteTask'
  },
  createTask: function (event) {
    event.preventDefault();
    var taskTitleInput = $('.task-title');
    var taskTitle = taskTitleInput.val();
    tasks.create({ title: taskTitle }, {
      success: function(task){ 
        $('#tasks ul')
          .prepend("<li data-id=" + task.id + ">" + taskTitle + " <button>Done!</button></li>");
        taskTitleInput.val('');
      }
    });
  },
  deleteTask: function (event) {
    var taskLi = this.$(event.currentTarget).parent();
    var id = taskLi.data('id');
    var taskForDeletion = tasks.get(id);
    $(taskLi).remove();
    tasks.remove(taskForDeletion);
  },

});
App.init = function() {
	var lastScrollTop = 0;
	$(window).scroll(function(event){
	   var st = $(this).scrollTop();
	   if (st > lastScrollTop){
	       // downscroll code
	  	new App.TasksView({ collection: tasks });
	   } else {
	      // upscroll code
		new App.View2(); 
	   }
	   lastScrollTop = st;
	});
   
     
 
}

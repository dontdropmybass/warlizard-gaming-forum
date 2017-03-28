var root = "http://ec2-54-91-162-178.compute-1.amazonaws.com:3000";

$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    getPosts();
  });

  function getPosts() {

      $.ajax({
  url: root + "/posts/",
  method: 'GET',
  success:function(data) {
  console.log(data);
  $("#BlogPostsTable").html("");
    for(i=0; i < data.length; i++){
        console.log(data[i]);
        //console.log(data[i]['title']);
        //console.log(data[i]['body']);
        $("#posts").append("<div id='post" + i + "' class='card'>" +
                           "<div id='post" + i + "title' class='card-title' >" +
                           "<h3>" + data[i]['title'] + "</h3>" + "</div>" +
                           "<div id='post" + i + "body' class='card-body'>" +
                           "<p>" + data[i]['body'] + "</p>" +  "</div>" +
                           "</div>");
    }

},
 error: function (request, status, error) {
        alert(request.responseText);
    }
});

  }
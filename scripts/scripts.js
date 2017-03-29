var root = "http://ec2-54-91-162-178.compute-1.amazonaws.com:3000";
var posts;

function getPosts() {

    $.ajax({
        url: root + "/posts",
        method: 'GET',
        success:function(data) {
            console.log(data);
            posts = data;
            $("#posts").html("");
            for(i=0; i < data.length; i++){
                console.log(data[i]);
                //console.log(data[i]['title']);
                //console.log(data[i]['body']);
                $("#posts").append( "<div id='post" + i + "' class='card'>" +
                                    "<div id='post" + i + "title' class='card-title' >" +
                                    "<h3>" + data[i]['title'] + "</h3>" + "</div>" +
                                    (data[i].imgLink!=undefined&&data[i].imgLink!=""?
                                        "<img src='"+data[i].imgLink+"' class='materialboxed'/>":
                                        "")+
                                    "<div id='post" + i + "body' class='card-body'>" +
                                    "<p>" + data[i]['body'] + "</p>" +  "</div>" +
                                    "</div>");
            }

        },
        error: function (e) {
            console.log(e);
        }
    });

}

function makePost(){
  //regex for imgur link
  //http://stackoverflow.com/questions/26457485/how-would-i-detect-what-is-an-imgur-picture-link-and-what-isnt
  var url = $("#add-img").val();
  //nevermind this dosen't work
  var imgur_re = new RegExp ("/^https?:\/\/(\w+\.)?imgur.com\/(\w*\d\w*)+(\.[a-zA-Z]{3})?$");
  if(url != "" && url != ""){
  var res = imgur_re.test(url);
}
else{
  //if they didn't enter a link then it's chill
  //no need to validate
  res = true;
}
  if(res){
    $.ajax({
        url: root + '/posts',
        type: 'POST',
        data: { 
            title: $("#add-title").val(),
            body: $("#add-body").val(),
            imgLink: url
        },
        dataType: 'json',
    error: function (request, status, error) {
        alert(request.responseText);
    },
    success:function(){
        location.reload(true);
    }

  });
}
else{
  //user entered improper URL so give them a message or something
  }


}

$( function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    getPosts();
});


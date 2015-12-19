$('#toggle-login').click(function(){
	if ($('#login').is(':hidden'))
  		$('#login').show();
  	else
  		$('#login').hide();
});

$('#toggle-comment').click(function(){	
	var b = $('#Comments-Title').html();
	if ($('#comment-form').is(':hidden'))
	 if (b == "")	 	
  		alert("Please, Select a Class");
  	 else
  	    $('#comment-form').show();
  	else
  		$('#comment-form').hide();
});

    Parse.initialize("dZAfQ7v9o7rkWn8dXFJZUqE2AJCVCtJ4xa9jP9OA", "qMeO2AQc2SHgiyn8DgNBB3oVGn2XSnWuZS1C6jR9");
    var Comment = Parse.Object.extend("Comment"); // Spelled the same as our class (table) on Parse
    var Answer = Parse.Object.extend("Answer");
    var Class =  Parse.Object.extend("Class");
    var idUser;
    var List_Class_Reg = new Array();
     	
        
    /******* CHECK USER LOG IN ********/
   function checkLogIn(){      
     	var user = Parse.User.current();
     	user.fetch().then(function(fetchedUser){
    		var name = fetchedUser.get("Name");
	    	if(name){
	      			$("#display_user").html("Welcome " + name);
      		} else {
		      	window.open("index2.html","_self");
		    }
			}, function(error){
			    //Handle the error
			}); 
			
	   if(Parse.User.current()){
        $("#idUser").html("Welcome cc: " + user.id);
        idUser = user.id;
      } 
         
    };

    checkLogIn();

    /******* LOG OUT ********/
    $("#logout").click(function(event){
      Parse.User.logOut();
      alert("You are logout");
      window.open("main.html","_self");
      checkLogIn();      
    });

    /****** GETTING ALL CLASSES AVAILABLE ********/
    function getClass(){
      var query = new Parse.Query("Class");
      query.find({
        success: function(results){
          var output = "";
          output += '<select id="options" name="class">';
          for (var i in results) {
            var title = results[i].get("Name");
            output += '<option value="' + results[i].get("objectId") + '"> ' + title + '</option><br>';  			
          }
          output += '</select>';
          $("#list_class").html(output);
       }, error: function(error){
          console.log("Query Error: " + error.message);
        }
      });
    }
    
    getClass();
    
    /****** CLASS - REGISTER ********/    
    $("#regClass").submit(function(event){  
  		event.preventDefault();
  		var Register = new Parse.Object.extend("Register");   			

  		var lista = document.getElementById("options");
		var indiceSeleccionado = lista.selectedIndex;
		var opcionSeleccionada = lista.options[indiceSeleccionado]; 
		
		var textoSeleccionado = opcionSeleccionada.value;
		var regClass = new Class({id: textoSeleccionado});
		
		var user = Parse.User.current();
		var newRegister = new Register();
		var exis = false;
		
		for (var j = 0; j<List_Class_Reg.length; j++) {
			if (List_Class_Reg[j] == regClass.get("Name"))
			  exis = true;
		}
		
		$('#login').hide();
		if (exis) 		
			alert ('You are registered in this class');		
		else {			
			newRegister.set("idUser",user);
			newRegister.set("idClass",regClass);
			newRegister.save();
			alert ('Successful Registration');
			getClassReg();
		}		
    }); 
    
       
    /****** GETTING CLASSES - REGISTER ********/
    function getClassReg(){
      var query = new Parse.Query("Register");
      var title, j = 0;
      query.include("User");
      query.include("Class");
      query.find({
        success: function(results){
          var output1 = "";
          output1 += '<ul>';
          for (var i in results) {
            var idclass = results[i].get("idClass");
            var user = results[i].get("idUser");
            title = idclass.get("Name");
            var id = idclass.get("objectId");
           	if (idUser == user.id){
           		output1 += '<li>';
           		output1 += "<h3><a href='" + results[i].get("idClass").id + "'>" + title + "</a></h3>";
           		output1 += '</li>';
           		List_Class_Reg[j] = title;
           		j++;
           	}
          }
          output1 += '</ul>';
          $("#list_ClassReg").html(output1);
          $('#toggle-login').show();
       }, error: function(error){
          console.log("Query Error: " + error.message);
        }
      });
    }
     
    getClassReg();    
     
    /****** GETTING CLASSES IN EACH COURSE ********/
    $("#list_ClassReg").on("click", "a", function(event) {    	
            event.preventDefault();
            var id;
            var output = "";
            var titleco = "";
            var idClic = $(this).attr("href");
            var query = new Parse.Query("Comment");
            query.include("user");
            query.find({
                success: function(results) {
                	for (var i=0; i<results.length; i++) {
                		var idC = results[i].get("idClass"); 
                		var b = true;               		
                		if (idClic == results[i].get("idClass").id){
                			var titleco = "Comments of " + idC.get("Name");
                    		var title = results[i].get("title");
                    		var content = results[i].get("content");
                    		var clike = results[i].get("Like");
                    		var user = results[i].get("user"); 
                    		var name = user.get("Name");
                    		var fecha = results[i].get("createdAt");
                    		id = results[i].id;
                    		idan = "Answer" + id;
 						   	output += '<h3>' + title + '</h3>';
 						   	output += '<small> By: ' + name + '<br>Date: ' + fecha + '</small>';
 						   	output += '<p>' + content + '</p>'; 
 						   	output += '<button id="' + id + '" value ="' + clike + '" onClick="BtnAnswer(this.id)">Answer</button>';
 						   	output += '<button id="' + id + '" value ="' + clike + '" onClick="Like(this.id)"><div id="test' + id + '">' + clike + '</div></button>';
 						   	output += '<button id="' + id + '" value ="' + clike + '" onClick="ViewAnswer(this.id)">View Answers</button>';
 						   	output += '<button id="' + id + '" onClick="DeleteComment(this.id)"><div>Delete</button>';
 						   	output += '<button id="' + id + '" onClick="EditComment(this.id)"><div>Edit</button>';
 						   	output += '<div id="' + idan + '"></div><br><br>';  						   	
 						}						
					}
					if (output == "")
 							$("#Comments-Title").html("There are not comments yet - Pressed on New Comment for you to be the first");
 						else{
 							$("#Comments-Title").html(titleco);
 						}
 					$("#postComments").html(output);
 					$("#idClassComm").html(idClic);
                 },
                error: function(error) {
                    console.log("Find post query error: " + error.message);
                }
            });
        });
    
    
    function ViewAnswer(clicked_id) { 
    		event.preventDefault();
            var outAns = "";
            var id;
            var query = new Parse.Query("Answer");
            query.include("user");
            query.find({
                success: function(results) {
                	for (var i=0; i<results.length; i++) {
                		if (clicked_id == results[i].get("idComment").id){                		
                			var title = results[i].get("title");
                    		var content = results[i].get("content");
                    		var clike = results[i].get("Like");
                    		var user = results[i].get("user"); 
                    		var name = user.get("Name");
                    		var fecha = results[i].get("createdAt");
                    		id = results[i].id;
                    		outAns += '<h5>' + title + '</h5>';
 						   	outAns += '<small> By: ' + name + '<br>Date: ' + fecha + '</small>';
 						   	outAns += '<p>' + content + '</p>'; 
 						   	outAns += '<button id="' + id + '" value ="' + clike + '" onClick="Like(this.id)"><div id="test' + id + '">' + clike + '</div></button>';
 						   	outAns += '<button id="' + id + '" onClick="Delete(this.id)"><div>Delete</button>'; 
 						   	outAns += '<button id="' + id + '" onClick="EditAns(this.id)"><div>Edit</button>';						   				
 						}						
					}
					$("#Answer" + clicked_id).html(outAns);	
                 },
                error: function(error) {
                    console.log("Find post query error: " + error.message);
                }
            });    
    }
        
 	function Like(clicked_id) {  
        	event.preventDefault();
        	var comment = new Comment();        	
        	var clike = document.getElementById(clicked_id).value;
        	clike++;
        	comment.id=clicked_id;
			comment.set("Like", clike);
			comment.save(null, {
  			success: function(comment) {
      			getClassReg();
      			$("#test" + clicked_id).html(clike);
  				},
			});		
      }  
      
      
     $("#regComment").submit(function(event) {
            event.preventDefault(); // Prevent refreshing after submitting
            var idCComm = $("#idClassComm").html();            
            var tComment = $("#TComment").val();
            var cComment = $("#CComment").val();
            var ClassComment = new Class({id: idCComm}); 
            var user = Parse.User.current();
 
            // Builds the comment object
            var comment = new Comment();
            comment.set("user", user);
            comment.set("Like",0);
            comment.set("title", tComment);
            comment.set("content", cComment);            
            comment.set("idClass", ClassComment); 
            comment.save({
                success: function(object) {
                	$('#comment-form').hide();
					alert ('You are registered in this class');
                    console.log("Comment saved: " + tComment);
                },
                error: function(obj, error) { // When saving, error function gets the obj you are trying to save and error
                    console.log("Comment save error: " + error.message);
                }
            });
        });    
  
   	
   	function BtnAnswer(clicked_id) { 
   			if ($('#answer-form').is(':hidden')){
   				$('#answer-form').show();
   				$("#idClaComm").html(clicked_id);}
  			else
  				$('#answer-form').hide(); 
  	}
  	
  	$("#regAnswer").submit(function(event) {
            event.preventDefault(); // Prevent refreshing after submitting
            var clicked_id = $("#idClaComm").html();             
            var tAnswer = $("#TAnswer").val();
            var cAnswer = $("#CAnswer").val();
            var comment = new Comment({id:  clicked_id}); 
            var user = Parse.User.current(); 
            // Builds the comment object
            var answer = new Answer();
            answer.set("user", user);
            answer.set("Like",0);
            answer.set("title", tAnswer);
            answer.set("content", cAnswer);            
            answer.set("idComment", comment); 
            answer.save({
                success: function(object) {
                	$('#answer-form').hide();
					alert ('You are registered a comment');
                    console.log("Comment saved: " + tAnswer);
                },
                error: function(obj, error) { // When saving, error function gets the obj you are trying to save and error
                    console.log("Comment save error: " + error.message);
                }
            });
    });    
      
  	function Delete(clicked_id) {  
		var query = new Parse.Query(Answer);
		query.get(clicked_id, {
  			success: function(myObj) {
    	   	 alert ('You are delete a comment');
    	    	myObj.destroy({});
  			},
  				error: function(object, error) {
    			console.log("Comment save error: " + error.message);
  			}
	  });
   }
	
	function DeleteComment(clicked_id) { 
		var query = new Parse.Query(Comment);
		query.get(clicked_id, {
  			success: function(myObj) {
    	    alert ('You are delete a comment');
    	    myObj.destroy({});
  		},
  			error: function(object, error) {
    		console.log("Comment save error: " + error.message);
  		}
	  });
	
    };
    
    function EditAns(clicked_id) {
    	event.preventDefault();
    	$('#editAns-form').show();
    	var query = new Parse.Query("Answer");
            query.find({
                success: function(results) {
                	for (var i=0; i<results.length; i++) {
                		if (clicked_id == results[i].id){                		
                			var title = results[i].get("title");
                			var content = results[i].get("content");
                			document.getElementById("TEdiAnswer").value = title;
    						document.getElementById("CEdiAnswer").value =  content;    
    						$("#idAns").html(clicked_id);
                		}
                	}
              	},
  				 error: function(object, error) {
    			 console.log("Comment save error: " + error.message);
  				}
            });            
    }

	$("#regEditAnswer").submit(function(event) {
            event.preventDefault(); // Prevent refreshing after submitting
            idAnsw = $("#idAns").html();
            var tAnswer = $("#TEdiAnswer").val();
            var cAnswer = $("#CEdiAnswer").val();
            var query = new Parse.Query(Answer);
            query.equalTo("objectId", idAnsw);
            query.first({
                   success: function (Answer) {
                   		Answer.save(null, {
                      		success: function (answer) {
                              		answer.set("title", tAnswer);
            						answer.set("content", cAnswer);  
                                    answer.save();
                					$('#editAns-form').hide();
									alert ('You are update');
                    				console.log("Comment saved: " + tAnswer);
                    		}
                    	});
                	},
                	error: function(obj, error) { 
                    	console.log("Comment save error: " + error.message);
                	}
            });
    });  
        
    function EditComment(clicked_id) {
    	event.preventDefault();
    	$('#editCom-form').show();
    	var query = new Parse.Query("Comment");
            query.find({
                success: function(results) {
                	for (var i=0; i<results.length; i++) {
                		if (clicked_id == results[i].id){                		
                			var title = results[i].get("title");
                			var content = results[i].get("content");
                			document.getElementById("TEdiComment").value = title;
    						document.getElementById("CEdiComment").value =  content;    
    						$("#idCom").html(clicked_id);
                		}
                	}
              	},
  				 error: function(object, error) {
    			 console.log("Comment save error: " + error.message);
  				}
            });            
    }
    
	$("#regEditComment").submit(function(event) {
            event.preventDefault(); // Prevent refreshing after submitting
            idComm = $("#idCom").html();
            var tComment = $("#TEdiComment").val();
            var cComment = $("#CEdiComment").val();
            var query = new Parse.Query(Comment);
            query.equalTo("objectId", idComm);
            query.first({
                   success: function (Comment) {
                   		Comment.save(null, {
                      		success: function (comment) {
                              		comment.set("title", tComment);
            						comment.set("content", cComment);  
                                    comment.save();
                					$('#editCom-form').hide();
									alert ('You are update');
                    				console.log("Comment saved: " + tComment);
                    		}
                    	});
                	}
            });
    });          



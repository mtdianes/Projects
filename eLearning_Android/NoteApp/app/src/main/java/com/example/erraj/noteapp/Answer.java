package com.example.erraj.noteapp;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ListActivity;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.parse.FindCallback;
import com.parse.ParseException;
import com.parse.ParseObject;
import com.parse.ParseQuery;
import com.parse.ParseUser;
import com.parse.SaveCallback;

import java.util.ArrayList;
import java.util.List;

public class Answer extends ListActivity {

    private List<Note> posts;
    protected EditText answer;
    protected Button AddReply;
    Note note;
    String commentId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_INDETERMINATE_PROGRESS);
        getActionBar().setDisplayHomeAsUpEnabled(true);
        setContentView(R.layout.activity_answer);
        Intent intent = this.getIntent();
        answer = (EditText) findViewById(R.id.answerbox);
        AddReply = (Button) findViewById(R.id.Addanswer);

        if (intent.getExtras() != null) {
            final ParseObject comm = new ParseObject("Comment");
            note = new Note(intent.getStringExtra("commentId"),intent.getStringExtra("commentBody"));

        }

        commentId = note.getId();

        AddReply.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String box = answer.getText().toString();
                box = box.trim();
                if (box.isEmpty()) {
                    AlertDialog.Builder builder = new AlertDialog.Builder(Answer.this);
                    builder.setMessage(R.string.signup_error_message_answer)
                            .setTitle(R.string.signup_error_title)
                            .setPositiveButton(android.R.string.ok, null);
                    AlertDialog dialog = builder.create();
                    dialog.show();
                } else {
                    setProgressBarIndeterminateVisibility(true);
                    final ParseObject comm = new ParseObject("Answer");
                    comm.put("user", ParseUser.getCurrentUser());
                    comm.put("content", box);
                    comm.put("title",commentId);
                    comm.put("idComment", ParseObject.createWithoutData("Comment", commentId));
                    setProgressBarIndeterminateVisibility(true);
                    comm.saveInBackground(new SaveCallback() {
                        public void done(ParseException e) {
                            setProgressBarIndeterminateVisibility(false);
                            if (e == null) {
                                // Saved successfully.
                                Toast.makeText(getApplicationContext(), "Saved", Toast.LENGTH_SHORT).show();
                            } else {
                                // The save failed.
                                Toast.makeText(getApplicationContext(), "Failed to Save", Toast.LENGTH_SHORT).show();
                                Log.d(getClass().getSimpleName(), "User update error: " + e);
                            }
                        }
                    });
                }
            }
        });
        posts = new ArrayList<Note>();
        ArrayAdapter<Note> adapter = new ArrayAdapter<Note>(this, R.layout.list_item_layout, posts);
        setListAdapter(adapter);
        refreshPostList();
    }

    private void refreshPostList() {


        ParseQuery<ParseObject> query = ParseQuery.getQuery("Answer");
        query.whereEqualTo("title", commentId);
        setProgressBarIndeterminateVisibility(true);
        query.findInBackground(new FindCallback<ParseObject>() {

            @Override
            public void done(List<ParseObject> postList, ParseException e) {
                setProgressBarIndeterminateVisibility(false);
                if (e == null) {
                    posts.clear();
                    for (ParseObject post : postList) {
                        {
                            Note note = new Note(post.getObjectId(), post.getString("content"));
                            posts.add(note);
                        }
                    }
                    ((ArrayAdapter<Note>) getListAdapter()).notifyDataSetChanged();


                } else {
                    Log.d(getClass().getSimpleName(), "Error: " + e.getMessage());
                }
            }
        });

    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_student_welcome, menu);
        return true;
    }


    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        switch (id) {

            case R.id.action_refresh: {
                refreshPostList();
                break;
            }

            case R.id.action_new: {
                Intent intent = new Intent(this, EditNoteActivity.class);
                startActivity(intent);
                break;
            }
            case R.id.action_settings: {
                break;
            }
            case R.id.action_logout: {
                ParseUser.logOut();
                loadLoginView();
                break;
            }

        }


        return super.onOptionsItemSelected(item);
    }
    private void loadLoginView(){
        Intent intent = new Intent(this, LoginActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
    }


}




package com.example.erraj.noteapp;

import android.app.AlertDialog;
import android.app.ListActivity;
import android.content.Intent;
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

public class Comment_view extends ListActivity {
    private List<Note> posts;
    private List<Comment> posts1;
    private Note note;
    private Comment comment ;
    TextView titleEditText;
    protected EditText commentbox;
    protected Button AddComment;
    String n;
    String classId;
    String id;
    String box;
    Comment com;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_INDETERMINATE_PROGRESS);
        getActionBar().setDisplayHomeAsUpEnabled(true);
        setContentView(R.layout.activity_comment_view);
        Intent intent = this.getIntent();

        titleEditText = (TextView) findViewById(R.id.className);
        commentbox = (EditText) findViewById(R.id.commentbox);
        AddComment = (Button) findViewById(R.id.AddComment);
        titleEditText.getText();
        if (intent.getExtras() != null) {

            note = new Note(intent.getStringExtra("noteId"), intent.getStringExtra("noteTitle"));
            titleEditText.setText(note.getTitle());

        }
        classId = titleEditText.getText().toString();
        id = note.getId();


        AddComment.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v) {
                // String classname = titleEditText.getText().toString().trim();
                box = commentbox.getText().toString();
                box = box.trim();
                if (box.isEmpty()) {
                    AlertDialog.Builder builder = new AlertDialog.Builder(Comment_view.this);
                    builder.setMessage(R.string.signup_error_message)
                            .setTitle(R.string.signup_error_title)
                            .setPositiveButton(android.R.string.ok, null);
                    AlertDialog dialog = builder.create();
                    dialog.show();
                } else {
                    setProgressBarIndeterminateVisibility(true);
                    final ParseObject comm = new ParseObject("Comment");
                    comm.put("user", ParseUser.getCurrentUser());
                    comm.put("status",ParseUser.getCurrentUser().getUsername());

                    comm.put("content", box);
                    comm.put("idClass",ParseObject.createWithoutData("Class",id));

                    comm.put("title", classId);
                    // comm.put("title", classname);
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

    private void refreshPostList()
    {
        ParseQuery<ParseObject> query = ParseQuery.getQuery("Comment");
        query.whereEqualTo("title", classId);

        setProgressBarIndeterminateVisibility(true);
        query.findInBackground(new FindCallback<ParseObject>() {

            @Override
            public void done(List<ParseObject> postList, ParseException e) {
                setProgressBarIndeterminateVisibility(false);
                if (e == null) {

                    posts.clear();
                    for (ParseObject post : postList) {
                        {
                            Note note = new Note(post.getObjectId(), post.getString("content")+"   "+"by "+post.getString("status"));
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
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
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
                // Do something when user selects Settings from Action Bar overlay
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

    protected void onListItemClick(ListView l, View v, int position, long id)
    {
        Note note = posts.get(position);
        Intent intent = new Intent(this, Answer.class);
        intent.putExtra("commentId", note.getId());
        intent.putExtra("commentBody", note.getTitle());
        startActivity(intent);


    }
}


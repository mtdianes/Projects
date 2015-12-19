package com.example.erraj.noteapp;

import android.app.ListActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import com.parse.FindCallback;
import com.parse.ParseException;
import com.parse.ParseObject;
import com.parse.ParseQuery;
import com.parse.ParseUser;
import java.util.ArrayList;
import java.util.List;

public class Teacher_welcome extends ListActivity {
        private List<Note> posts;
        @Override
        protected void onCreate(Bundle savedInstanceState) {

            super.onCreate(savedInstanceState);
            requestWindowFeature(Window.FEATURE_INDETERMINATE_PROGRESS);


            setContentView(R.layout.activity_teacher_welcome);
            ParseUser currentUser = ParseUser.getCurrentUser();

            if (currentUser == null) {
                loadLoginView();
            }

            posts = new ArrayList<Note>();
            ArrayAdapter<Note> adapter = new ArrayAdapter<Note>(this, R.layout.list_item_layout, posts);
            setListAdapter(adapter);
            refreshPostList();
    }
    private void loadLoginView(){
        Intent intent = new Intent(this, LoginActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
    }

    private void refreshPostList() {
        ParseQuery<ParseObject> query = ParseQuery.getQuery("Class");
        setProgressBarIndeterminateVisibility(true);
        query.findInBackground(new FindCallback<ParseObject>() {

            @Override
            public void done(List<ParseObject> postList, ParseException e) {
                setProgressBarIndeterminateVisibility(false);
                if (e == null) {
                    // If there are results, update the list of posts
                    // and notify the adapter
                    posts.clear();
                    for (ParseObject post : postList) {
                        Note note = new Note(post.getObjectId(), post.getString("Name"));
                        posts.add(note);


                    }
                    ((ArrayAdapter<Note>) getListAdapter()).notifyDataSetChanged();


                } else {
                    Log.d(getClass().getSimpleName(), "Error: " + e.getMessage());
                }
            }
        });
    }
 /*   public void delete(){
        ParseObject comm1 = new ParseObject("Class");
        ParseQuery<ParseObject> query = ParseQuery.getQuery("Class");
        query.whereEqualTo("objectId", comm1.getObjectId());
        query.findInBackground(new FindCallback<ParseObject>() {
            public void done(List<ParseObject> invites, ParseException e) {
                if (e == null) {
                    // iterate over all messages and delete them
                    for (ParseObject invite : invites) {
                        invite.deleteInBackground();
                    }
                } else {
                    //Handle condition here
                }
            }
        });
    }*/
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
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


    //select a list item and see its details in the Add/Edit view.
    @Override
    protected void onListItemClick(ListView l, View v, int position, long id)
    {

        Note note = posts.get(position);
        Intent intent = new Intent(this, Comment_view.class);
        intent.putExtra("noteId", note.getId());
       intent.putExtra("noteTitle", note.getTitle());
        //intent.putExtra("name", note.getClass());
        startActivity(intent);

    }
}

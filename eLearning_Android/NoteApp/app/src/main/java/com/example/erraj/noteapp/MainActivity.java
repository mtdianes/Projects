package com.example.erraj.noteapp;

import android.app.ListActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.widget.TextView;
import com.parse.ParseUser;
import java.util.List;
import java.util.Objects;

public class MainActivity extends ListActivity {

    private List<Note> posts;
    private Comment c;
    public String statusTxt;
    @Override
    protected void onCreate(Bundle savedInstanceState)
    {

        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_INDETERMINATE_PROGRESS);


        setContentView(R.layout.activity_main);
        ParseUser currentUser = ParseUser.getCurrentUser();
        if (currentUser == null) {
            statusTxt="Teacher";
        }
        else {
            statusTxt = currentUser.getString("Status");

        }


        TextView textView = (TextView)findViewById(R.id.statusText);
        textView.setText(statusTxt);

        textView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (Objects.equals(statusTxt, "Teacher")) {
                    Intent intent = new Intent(MainActivity.this, Teacher_welcome.class);
                    startActivity(intent);

                } else if(Objects.equals(statusTxt,"Student")){
                    Intent intent = new Intent(MainActivity.this, Student_welcome.class);
                    startActivity(intent);
                }

            }
        });





        if (currentUser == null) {
            loadLoginView();
        }

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

           /* case R.id.action_new: {
                Intent intent = new Intent(this, EditNoteActivity.class);
                startActivity(intent);
                break;
            }*/
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


}



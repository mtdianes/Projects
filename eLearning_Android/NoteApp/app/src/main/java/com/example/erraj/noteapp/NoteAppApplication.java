package com.example.erraj.noteapp;

import com.parse.Parse;
import com.parse.ParseObject;

/**
 * Created by erraj on 12/9/2015.
 */
public class NoteAppApplication extends android.app.Application {
    @Override
    public void onCreate() {
        super.onCreate();
        ///Parse.initialize(this,"dZAfQ7v9o7rkWn8dXFJZUqE2AJCVCtJ4xa9jP9OA", "qMeO2AQc2SHgiyn8DgNBB3oVGn2XSnWuZS1C6jR9");
        Parse.initialize(this, "9cTEPhALPtIZG62RxjiQYFZfE9hp0EQZ2C8bALlP", "FXs8qkbRUWQm0xfK57LYFWPJTzsLjeNiU0dbozOB");


    }


}

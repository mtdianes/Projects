package com.example.erraj.noteapp;
/**
 * Created by erraj on 12/9/2015.
 */
public class Note {
    private String id;
    private String name;

    Note(String noteId, String names) {
        id = noteId;
        name = names;

    }

    public String getId()
    {

        return id;
    }
    public void setId(String id)
    {

        this.id = id;
    }
    public String getTitle()
    {
        return name;
    }
    public void setTitle(String name) {
        this.name = name;
    }
    @Override
    public String toString() {
        return this.getTitle();
    }




}

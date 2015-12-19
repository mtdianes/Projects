package com.example.erraj.noteapp;

/**
 * Created by erraj on 12/14/2015.
 */
public class Comment {
    private String name;
    String id;
    Comment(String id,String names) {
        this.id= id;
        name = names;

    }
    public String getcommentId()
    {

        return id;
    }
    public void getcommentId(String id)
    {

        this.id = id;
    }
    public String gettitle()
    {

        return name;
    }
    public void settitle(String id)
    {

        this.name = name;
    }
    @Override
    public String toString() {
        return this.gettitle();
    }
}

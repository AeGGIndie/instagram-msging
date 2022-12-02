"use strict";

import * as loading from "loading-cli";
import prompt, {get} from "prompt";
import * as dotenv from 'dotenv'
import {MinimalThreadItem} from "./src/MinimalThreadItem";
import {InstagramManager} from "./src/InstagramManager"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import exampleData from "./exampleData.json";

dotenv.config();

/*
   //Basics of how to message someone
   const userId : number = await ig.user.getIdByUsername("username");
   const thread : DirectRepositoryCreateGroupThreadResponseRootObject = await ig.direct.createGroupThread([userId.toString()], "username");
   const realThread : DirectThreadEntity = new DirectThreadEntity(ig);
   realThread.threadId = thread.thread_id;
   realThread.broadcastText("message to send");
*/

const followSchema = {
    properties: {
        userToMessage: {
            required: true,
            description: "Enter the username of the user you would like to message (enter \"q`\" to quit)",
        },
    }
};

const messageSchema = {
    properties: {
        msg: {
            required: true,
            description: "Enter a message (enter \"q`\" to quit)",
        },
    }
};


(async () => {
    // handle login
//  const igManager = new InstagramManager(process.env.USERNAME!, process.env.PASSWORD!);
    let load = loading.default("Logging In...").start();
//  await igManager.init();
    load.color = "yellow"
    load.stop();

    // get the 20 most recent dms and display them
    prompt.start();
    const recentDMs: MinimalThreadItem[] = exampleData;
//  const recentDMs : MinimalThreadItem[] = await igManager.fetchRecentMinimal();
//    console.log(JSON.stringify(recentDMs));
    recentDMs.forEach((dm, index) => console.log(`${dm.hasNewMessages ? "(!)" : ""} [${index + 1}]. ${dm.threadTitle} - ${
        dm.users.map((user, index) => {
        if (index === 5) {
            return "(+)";
        }
        if (index > 4) {
            return;
        }
        return user.username;
    })}`));
    const {person} = await get([{
        name: "person",
        required: true,
        type: "number",
        description: "Enter a number from 1-20 to choose the chat you would like to start",
    }]);
    console.log('person: ', person);

    // prompt the user to choose a person to message


//  (await igManager.fetchRecentDMs()).forEach(dm => console.log(dm));
    /*
    // start messaging state
    let messaging = true;
    prompt.start();

    // prompt the user for who they want to message
    while(messaging){
      // show the user their inboxes and who they would like to message

      let { userToMessage } = await get(followSchema);
      // check that the user wants to stop messaging
      if (userToMessage as string === "q`"){
        messaging = false;
        continue;
      }

      // prompt the user for message to send
      let msgResult : prompt.Properties | undefined;
      while(( (msgResult = await get(messageSchema)).msg) as string !== "q`"){
        // send a message
        const { msg } = msgResult;
        console.log(`Messaging:\"${userToMessage as string}\" with \"${msg as string}\"`);
        await igManager.sendDirectMessage(userToMessage as string, msg as string);
      }
    }

    */
    // end protocol to let the user know we've finished
    load = loading.default("Logging Out...").start();
    load.color = "red"
    await igManager.exit();
    load.stop();
    console.log("Thank you for using Instagram Messaging CLI");
})();

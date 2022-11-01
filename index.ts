"use strict";

import * as loading from "loading-cli";
import prompt, { get } from "prompt";
import { AccountRepositoryLoginResponseLogged_in_user, DirectRepositoryCreateGroupThreadResponseRootObject, DirectThreadEntity, IgApiClient } from "instagram-private-api";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
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
}

const messageSchema = {
  properties: {
    msg: {
      required: true,
      description: "Enter a message (enter \"q`\" to quit)",
    },
  }
}

// setting up instagram client
const ig : IgApiClient = new IgApiClient();
ig.state.generateDevice(process.env.USERNAME!);

(async () => {
	// handle login
  let load = loading.default("Logging In...").start();
  load.color = "yellow"
	const auth : AccountRepositoryLoginResponseLogged_in_user = await ig.account.login(
		process.env.USERNAME!,
		process.env.PASSWORD!
	);
  load.stop();

  
  // start messaging state
  let messaging = true;
  prompt.start();

  // prompt the user for who they want to message
  while(messaging){
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
      const userId : number = await ig.user.getIdByUsername(userToMessage as string);
      console.log(`userId:\"${userId}\"`);

      const userThread : DirectRepositoryCreateGroupThreadResponseRootObject = await ig.direct.createGroupThread([userId.toString()], userToMessage as string);
      const threadInstance : DirectThreadEntity = new DirectThreadEntity(ig);
      threadInstance.threadId = userThread.thread_id;
      threadInstance.broadcastText(msg as string);      
    }
  }
  

  // end protocol to let the user know we've finished
  load = loading.default("Logging Out...").start();
  load.color = "red"
	await ig.account.logout();
  load.stop();
  console.log("Thank you for using Instagram Messaging CLI");
})();

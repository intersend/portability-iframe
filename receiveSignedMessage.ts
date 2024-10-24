// src/utils/receiveSignedMessage.ts

// This utility handles the communication between the child iframe (your app) and the parent iframe.
// It listens for the response from the parent iframe after sending a JSON-RPC request (e.g., eth_signMessage).
// The parent iframe returns a message with a signed message hash in the expected format.

export type SignMessageResponse = {
  messageHash: string;
};

/**
 * Sets up a listener for receiving a signed message response from the parent iframe.
 * 
 * @param requestId - The unique JSON-RPC request ID for tracking the response.
 * @param callback - A function that processes the response once received.
 * 
 * Example Usage:
 * 
 * receiveSignedMessage('unique-request-id', (response) => {
 *   console.log('Received signed message hash:', response.messageHash);
 *   // Further processing with the message hash can be done here.
 * });
 */
export function receiveSignedMessage(requestId: string, callback: (response: SignMessageResponse) => void) {
  // Define a handler for the 'message' event to process messages from the parent iframe
  function messageHandler(event: MessageEvent) {
    const { data } = event;

    // Validate the incoming message format based on JSON-RPC and request ID
    if (
      data &&
      data.id === requestId && // Ensure it's the correct response for our request
      data.result && 
      data.result.messageHash // The expected structure
    ) {
      // Construct the response based on the received data
      const response: SignMessageResponse = {
        messageHash: data.result.messageHash,
      };

      // Execute the callback with the signed message response
      callback(response);

    }
  }

  // Add the message event listener to listen for responses from the parent iframe
  window.addEventListener('message', messageHandler);
}

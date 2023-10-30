import 'reflect-metadata';

if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
    process.on('unhandledRejection', reason => {
        console.log('oooops', reason);
      throw reason
    })

    // Avoid memory leak by adding too many listeners
    process.env.LISTENING_TO_UNHANDLED_REJECTION = 'true';
  }
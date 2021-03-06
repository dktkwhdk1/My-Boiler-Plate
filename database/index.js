import dotenv from 'dotenv';
dotenv.config();

const { MONGO_DATABASE, MONGO_USERNAME, MONGO_PASSWORD } = process.env;

export const dbConnection = {
  url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@my-boiler-plate.ycetb.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority`,
  options: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};

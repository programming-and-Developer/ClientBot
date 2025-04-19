import PromptPage from "./PromptPage";
import Tokens from "./Tokens";
import ApiKeyPage from "./ApiKeyPage";
import Start_Stop_Bot from "./Start-StopBot";
import UploadImage from "./UploadImage";
import ChangeModel from "./Change model";

function Home() {
  return (
    <>
      <Start_Stop_Bot />
      <ApiKeyPage />
      <ChangeModel />
      <Tokens />
      <PromptPage />
      <UploadImage />
    </>
  );
}

export default Home;
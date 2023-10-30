import { ComponentIndexingTask } from "./Backend/BuildTasks/ComponentIndexingTask";
import { ViewBuilderTask } from "./Backend/BuildTasks/ViewBuilderTask";
import { compile } from "./Backend/compiler";

compile('../example/', [new ViewBuilderTask(), new ComponentIndexingTask()]);
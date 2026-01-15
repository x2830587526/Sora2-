export interface StoryboardSegment {
  time: string;
  camera: string;
  action: string;
}

export interface CharacterDetail {
  description: string;
  dialogue: string;
}

export interface SoraScene {
  scene_id: string;
  location: string;
  time: string;
  visual_description: string;
  camera_movement: string;
  action: string;
  dialogue: string;
  duration: string;
}

export interface SoraPromptStruct {
  project_title: string;
  format: string;
  style: string;
  scenes: SoraScene[];
}

export interface ScriptResponse {
  storyboard: StoryboardSegment[];
  character: CharacterDetail;
  soraPrompt: SoraPromptStruct;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
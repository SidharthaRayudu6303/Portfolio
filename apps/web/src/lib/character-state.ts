// Lightweight character reaction coordinator
// Dispatches and listens to character state changes with zero external dependencies

export type CharacterReaction = 'idle' | 'projects' | 'skills' | 'contact' | 'resume' | 'about' | 'experience' | 'home' | 'surprised';

const EVENT_NAME = 'character-reaction-change';

export function setCharacterReaction(reaction: CharacterReaction) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<CharacterReaction>(EVENT_NAME, { detail: reaction })
  );
}

export function subscribeCharacterReaction(callback: (reaction: CharacterReaction) => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<CharacterReaction>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}


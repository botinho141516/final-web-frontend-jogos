import { css } from "@emotion/react";
import styled from "styled-components";
import React, { useCallback } from "react";
import { atom, useRecoilState } from "recoil";

interface ModalAtomValue {
  id: string;
  component: JSX.Element | null;
  title?: string | null;
  removeHeader?: boolean;
}

interface ModalHook {
  /**
   * `pushModal` has a fire-and-forget mode and it also has an awaitable mode.
   *
   * For the fire and forget mode:
   * ```js
   * const modal = useModal();
   * modal.pushModal(<div>Hello</div>);
   * ```
   *
   * For an awaitable interaction:
   * ```js
   * const modal = useModal();
   *
   * const awaitableInteraction =
   *  modal.pushModal(interaction =>
   *   <div onClick={() => interaction("clicked")}>
   *    Click me!
   *   </div>
   *  )
   *
   * const interactionResult = await awaitableInteraction;
   * console.log(interactionResult); // "clicked"
   * ```
   */
  pushModal: {
    (
      componentOrFunction: JSX.Element,
      title?: string | undefined,
      removeHeader?: boolean
    ): null;
    (
      componentOrFunction: ElementWithPromise,
      title?: string | undefined,
      removeHeader?: boolean
    ): Promise<unknown>;
  };
  popModal: () => void;
  popAll: () => void;
}

const ModalAtom = atom<ModalAtomValue[]>({
  key: "ModalAtom",
  default: [],
});

type PromiseResolve = (value: unknown) => void;
type ElementWithPromise = (onModalInteraction: PromiseResolve) => JSX.Element;

export function useModal(): ModalHook {
  const [modalAtom, setModalAtom] = useRecoilState(ModalAtom);

  function pushModalSignature(
    componentOrFunction: JSX.Element,
    title?: string,
    removeHeader?: boolean
  ): null;
  function pushModalSignature(
    componentOrFunction: ElementWithPromise,
    title?: string,
    removeHeader?: boolean
  ): Promise<unknown>;
  function pushModalSignature(
    componentOrFunction: JSX.Element | ElementWithPromise,
    title?: string,
    removeHeader?: boolean
  ): null | Promise<unknown> {
    if (typeof componentOrFunction === "function") {
      const componentFunction = componentOrFunction as (
        onModalInteraction: (value: unknown) => void
      ) => JSX.Element;

      let modalResolve: (value: unknown) => void;
      const modalPromise = new Promise((resolve) => {
        modalResolve = resolve;

        const component = componentFunction(modalResolve);
        // This is like this because this hook stores the modal stack from before the current is opened,
        // so modalAtom is one modal behind, currentState otherwise is always updated
        setModalAtom((currentState) => [
          ...currentState,
          {
            id: `${Math.random()}`,
            component,
            title,
            removeHeader,
          },
        ]);
      });

      return modalPromise;
    }

    const component = componentOrFunction as JSX.Element;
    // This is like this because this hook stores the modal stack from before the current is opened,
    // so modalAtom is one modal behind, currentState otherwise is always updated
    setModalAtom((currentState) => [
      ...currentState,
      {
        id: `${Math.random()}`,
        component,
        title,
        removeHeader,
      },
    ]);

    return null;
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pushModal = useCallback(pushModalSignature, [modalAtom]);

  const popModal = useCallback(() => {
    // This is like this because this hook stores the modal stack from before the current is opened,
    // so modalAtom is one modal behind, currentState otherwise is always updated
    setModalAtom((currentState) => {
      const state = [...currentState];

      state.pop();

      return state;
    });
  }, [setModalAtom]);

  const popAll = useCallback(() => {
    setModalAtom([]);
  }, [setModalAtom]);

  return { pushModal, popModal, popAll };
}

const Root = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #00000066;
  z-index: 9999;
`;

const ModalBody = styled.div`
  align-items: center;
  position: relative;
  width: auto;
  height: auto;
  display: grid;
  grid-template:
    "title title close"
    "comp comp comp";
  grid-template-rows: 30px auto;
  grid-template-columns: 1fr 1fr 1fr;
  border-radius: 10px;
  padding: 25px;
  z-index: 10;

  @media only screen and (max-width: 800px) {
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
  }

  background-color: white;
`;

const Component = styled.div`
  grid-area: comp;
`;

const Title = styled.div`
  grid-area: title;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #2f2f2f;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.18px;
`;

const CloseIconContainer = styled.div`
  grid-area: close;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 5px;
  cursor: pointer;
`;

export default function Modal(): JSX.Element {
  const [modalAtom, setModalAtom] = useRecoilState(ModalAtom);

  function handleCloseModal(currentId: string) {
    setModalAtom(modalAtom.filter(({ id }) => currentId !== id));
  }

  return (
    <>
      {modalAtom.map((modal) => (
        <Root key={modal.id}>
          <ModalBody onClick={(e) => e.stopPropagation()}>
            <CloseIconContainer onClick={() => handleCloseModal(modal.id)}>
              X
            </CloseIconContainer>

            <Title>{modal?.title}</Title>
            <Component>{modal.component}</Component>
          </ModalBody>
        </Root>
      ))}
    </>
  );
}

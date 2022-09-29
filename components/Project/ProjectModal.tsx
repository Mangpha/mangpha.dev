import { Transition, Dialog } from '@headlessui/react';
import { NextPage } from 'next';
import { Fragment } from 'react';
import { IProjectProps } from '../../data/projectData';

interface IProjectModalProps {
  isOpen: boolean;
  closeModal: () => void;
  projectData: IProjectProps;
}

export const ProjectModal: NextPage<IProjectModalProps> = ({ isOpen, closeModal, projectData }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-medium leading-6 text-gray-900 dark:text-gray-100">
                  {projectData.title}
                </Dialog.Title>
                <div className="my-5 flex justify-center">
                  <img src={projectData.img} alt="" />
                </div>
                <div className="my-2 text-lg text-gray-600 dark:text-gray-300">
                  <p className="my-3">
                    <span className="font-semibold mr-5">Position:</span> {projectData.position}
                  </p>
                  <p className="my-3">
                    <span className="font-semibold mr-5">Github:</span> {projectData.github}
                  </p>
                  <p className="my-3">
                    <span className="font-semibold mr-5">Date:</span> {projectData.date}
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
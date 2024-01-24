'use client'
import { useState } from 'react';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import useConversation from '@/app/hooks/useConversation';
import MessageInput from './MessageInput';
import { CldUploadButton } from 'next-cloudinary';
import { FullMessageType } from '@/app/types';

const Form = () => {
  const { conversationId } = useConversation();
  const [messages, setMessages] = useState<FullMessageType[]>([]); // State to manage messages

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      updateMessagesLocally(data);

      // Perform the actual API request
      const response = await axios.post('/api/messages', {
        ...data,
        conversationId: conversationId,
      });

      if (response.status === 200) {
        setValue('message', '', { shouldValidate: true });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpload = async (result: any) => {
    try {
      // Immediately update UI on file upload (optimistic update)
      updateMessagesLocally({ image: result.info.secure_url });

      // Perform the actual API request
      const response = await axios.post('/api/messages', {
        image: result.info.secure_url,
        conversationId: conversationId,
      });

      if (response.status === 200) {
        setValue('message', '', { shouldValidate: true });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateMessagesLocally = (newMessage: any) => {
    setMessages((currentMessages) => [...currentMessages, newMessage]);
    console.log(newMessage);
  };

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton options={{ maxFiles: 1 }} onUpload={handleUpload} uploadPreset="apdxsou1">
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 lg:gap-4 w-full">
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;

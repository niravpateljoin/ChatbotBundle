<?php
namespace Chatbot\Form;

use Chatbot\Entity\ChatbotCategory;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

class ChatbotFaqType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('question', TextType::class)
            ->add('answer', TextareaType::class)
            ->add('category', EntityType::class, [
                'class' => ChatbotCategory::class,
                'choice_label' => 'name',
                'required' => true, // Ensures the field is not nullable
                'placeholder' => 'Select a category',
            ]);
    }
}

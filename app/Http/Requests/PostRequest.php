<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class PostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'categoryId' => 'required|integer|exists:categories,id',
            'content' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:png,jpg,jpeg|max:2048'
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors()->getMessages();

        $errorMessage = [];

        foreach ($errors as $field => $messages) {
            $errorMessage[$field] = $messages[0];
        }

        throw new HttpResponseException(
            response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $errorMessage,
            ], 422)
        );
    }
}

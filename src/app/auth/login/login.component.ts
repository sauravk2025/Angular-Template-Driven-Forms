import { afterNextRender, Component, DestroyRef, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports:[FormsModule],
})
export class LoginComponent {

  private formSignal = viewChild.required<NgForm>('formVariable')
  private destroyRef = inject(DestroyRef)

  constructor()
  {

    afterNextRender(()=>{
      console.log('form signal:',this.formSignal())
      const savedForm = localStorage.getItem('LoginInfo');
      console.log('saved Form:',savedForm)
      if(savedForm)
      {
        const loadFormData = JSON.parse(savedForm);
        const savedEmail = loadFormData.email;
        console.log('savedEmail:',savedEmail)
        // console.log('formsignal valuechange',this.formSignal().setValue({}))
        
        // this.formSignal().controls['emailValue'].setValue({
        //   emailValue:savedEmail,
        // 
        // }) this alone wont work as control elements are full initialised so we have to wait for some times

        setTimeout(()=>{
            this.formSignal().controls['emailValue'].setValue(savedEmail)
        },1)
      }


      console.log('formSignal value changes:',this.formSignal()?.valueChanges)
      
      const subscribe = this.formSignal()?.valueChanges?.pipe(debounceTime(500))
      .subscribe({
        next:(value)=> {
          // console.log('value emitted email:',value.emailValue);
          // console.log('value emitted password:',value.passwordValue);
          localStorage.setItem('LoginInfo',JSON.stringify
          ({email:value.emailValue,
           password:value.passwordValue
        })) }
      })
      //updates only if i stop typing for atleast 500ms
      this.destroyRef.onDestroy(()=>subscribe?.unsubscribe())
    
      })

   
  }
onSubmit(formItem:NgForm)
{
  if(formItem.form.invalid)
  {    //console.log(formItem);
      return
  }
  const enteredEmail =  formItem.form.value.emailValue;
  const enteredPassword = formItem.form.value.passwordValue;
  //console.log('email:',enteredEmail,'password:',enteredPassword)
 
 //formItem.form.reset() //reset the css classes as well
  
}

}

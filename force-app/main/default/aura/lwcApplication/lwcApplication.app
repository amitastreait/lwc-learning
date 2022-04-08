<aura:application extends="force:slds">
    <!-- <c:lwcBacth1Session2 /> -->
    <!-- <c:toDoList /> -->
    <!--<c:lwcBatch1Session3 />-->
    <!-- <c:lwcbatchgetterSetterDemo />-->
    <!-- <c:parentSlot /> -->
    <!-- <c:parentComponent/> -->
    <c:contactList />
</aura:application>

<!--
    Parent Component
        1. Child 1
            1. Child 1
        2. Child 2 - on
            Firing the Event
    <c-parent>
        <c-child-1 message={message}>
            @api message
            <child-1-1 message={message}>
                @api message
            </child-1-1>
        </c-child-1>
        <c-child-2 onfireEvent={handleChange}>
            <!-- Fire the Event - ->
        </c-child-2>
    </c-parent>
    class ParentComponent extends LightningElement{
        handleChange(event){
            let message = event.detail.message;
            let childComponent = this.template.querySelectr('c-child-1');
            childComponent.handleValue( message );
        }
    }
    class ChildComponent extends LightningElement{
        handleValue(message){
            let child1Component = this.template.querySelectr('child-1-1');
            child1Component.handleValue( message );
        }
    }
-->